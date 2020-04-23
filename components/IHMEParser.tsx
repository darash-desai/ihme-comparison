import { useState, useEffect } from "react";
import { FileDrop, FileDropProps } from "react-file-drop";
import Papa, { ParseResult } from "papaparse";
import { ChartPoint } from "chart.js";
import dayjs from "dayjs";

import styles from "./IHMEParser.module.scss";

interface IHMEDataPoint {
  location_name: string;
  date_reported: string;
  date: string;
  allbed_mean: string;
  allbed_lower: string;
  allbed_upper: string;
  ICUbed_mean: string;
  ICUbed_lower: string;
  ICUbed_upper: string;
  InvVen_mean: string;
  InvVen_lower: string;
  InvVen_upper: string;
  deaths_mean: string;
  deaths_lower: string;
  deaths_upper: string;
  admis_mean: string;
  admis_lower: string;
  admis_upper: string;
  newICU_mean: string;
  newICU_lower: string;
  newICU_upper: string;
  totdea_mean: string;
  totdea_lower: string;
  totdea_upper: string;
  bedover_mean: string;
  bedover_lower: string;
  bedover_upper: string;
  icuover_mean: string;
  icuover_lower: string;
  icuover_upper: string;
}

type IHMEDatum = keyof IHMEDataPoint;
type IHMEChartData = { [key: string]: ChartPoint[] };

export interface IHMEParserProps {
  location?: string;
  yDatum?: IHMEDatum;

  onUpdate?(data: IHMEChartData): void;
}

const IHMEParser = ({
  location = "Massachusetts",
  yDatum = "deaths_mean",
  onUpdate,
}: IHMEParserProps): JSX.Element => {
  type ParsedData = { [key: string]: { file: File; data: IHMEDataPoint[] } };
  const [parsedData, setParsedData] = useState<ParsedData>({});

  // Invoke onUpdate() callback function whenever a change to the parsed IHME
  // model data has been made, or the user has chosen to alter the information
  // to be plotted. A dependency list containing `parsedData`, `location`,
  // and `yDatum` is provided to prevent any unnecessary calls to the callback
  // function.
  useEffect(() => {
    const data = Object.keys(parsedData).reduce<IHMEChartData>(
      (allData, filename) => {
        // Filter data for appropriate location
        const { file, data } = parsedData[filename];
        const filteredData = data.filter(
          (value) => value.location_name == location
        );

        // Extract relevant chart data
        const label = dayjs(file.lastModified).format("MM-DD-YYYY");
        const returnData = filteredData.map((value) => {
          const date = dayjs(
            value["date_reported"] || value["date"],
            "YYYY-MM-DD"
          );
          return {
            x: date.toDate(),
            y: parseFloat(value[yDatum]),
          };
        });

        // Only include data if the dataset is non-zero
        if (returnData.length > 0) {
          allData[label] = returnData;
        }

        return allData;
      },
      {}
    );

    onUpdate?.(data);
  }, [parsedData, location, yDatum]);

  const onFileDrop: FileDropProps["onDrop"] = async (files, eventIgnored) => {
    if (files) {
      const newData = { ...parsedData };
      let dataUpdated = false;

      for (let index = 0; index < files.length; index++) {
        const file = files.item(index);
        if (file) {
          // Only parse data if it has not been parsed yet
          const { name, lastModified, size } = file;
          const fileId = `${name}-${lastModified}-${size}`;
          if (parsedData[name]) {
            return;
          }

          const result = await new Promise<ParseResult>((resolve, reject) => {
            const result = Papa.parse(file, {
              header: true,
              complete: (result, fileIgnored) => {
                resolve(result);
              },
              error: (error, fileIgnored) => {
                reject(error);
              },
            });

            if (result) {
              resolve(result);
            }
          });

          const { data } = result;
          if (data) {
            newData[fileId] = {
              file: file,
              data,
            };

            dataUpdated = true;
          }
        }
      }

      if (dataUpdated) {
        setParsedData(newData);
      }
    }
  };

  return (
    <FileDrop
      className={styles.fileDrop}
      targetClassName={`${styles.fileDropTarget} d-flex justify-content-center align-items-center`}
      draggingOverFrameClassName={styles.fileDropDraggingOverFrame}
      draggingOverTargetClassName={styles.fileDropDraggingOverTarget}
      onDrop={onFileDrop}
    >
      Drop some files here!
    </FileDrop>
  );
};

IHMEParser.displayName = "IHMEParser";

export default IHMEParser;

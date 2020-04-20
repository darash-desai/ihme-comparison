import { FileDrop, FileDropProps } from "react-file-drop";

import styles from "./IHMEParser.module.scss";

const IHMEParser = (): JSX.Element => {
  const onFileDrop: FileDropProps["onDrop"] = (files, eventIgnored) => {
    console.log("Files", files);
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

import styles from "./ResetButton.module.css";

type ResetButtonProps = {
  onReset: () => void;
};

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button className={styles.reset} type="button" onClick={onReset}>
      Reset
    </button>
  );
}

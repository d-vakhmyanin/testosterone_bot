import styles from './Spinner.module.css';

type SpinnerProps = {
    size?: number;
    className?: string;
};

export const CenteredSpinner: React.FC<SpinnerProps> = (props) => {
    return (
        <div className={styles.spinner_container}>
            <Spinner {...props} />
        </div>
    );
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 64, className }) => {
    return (
        <div
            className={`${styles.spinner} ${className ?? ''}`}
            style={{ width: size, height: size }}
            role="status"
            aria-label="Loading"
        />
    );
};

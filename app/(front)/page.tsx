import styles from './page.module.css';

const Home = () => {
    return (
        <div className={styles.page}>
            <main className={styles.main}>hello world main</main>
            <footer className={styles.footer}>hello world footer</footer>
        </div>
    );
};

export default Home;

import { Wheel } from './components/Wheel/Wheel';
import styles from './page.module.css';

const Home = () => {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>Колесо</h1>
                <Wheel />
            </main>
        </div>
    );
};

export default Home;

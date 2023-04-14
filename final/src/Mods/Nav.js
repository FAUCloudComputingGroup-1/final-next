import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Nav.module.css';

const Nav = () => {
  const router = useRouter();
  
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <span className={`${styles.navlink} ${router.pathname === "/" ? styles.active : styles.navLink}`}>
          Home
        </span>
      </Link>
      <Link href="/ProtectedPage">
        <span className={`${styles.navlink} ${router.pathname === "/ProtectedPage" ? styles.active : styles.navLink}`}>
          Gallery/Upload
        </span>
      </Link>
    </nav>
  );
};

export default Nav;

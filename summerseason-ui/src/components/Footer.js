import "bootstrap/dist/css/bootstrap.min.css";

function Footer(){
    return (
      <footer className="bg-light text-center text-muted py-4 border-top mt-5">
        <div className="container">
          © {new Date().getFullYear()} Summer Season - Tutti i diritti riservati
        </div>
      </footer>
  );

}

export default Footer;
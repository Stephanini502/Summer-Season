import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MainPage() {
  const navigate = useNavigate();

  return (
    <div>

      <div className="container py-5 text-center bg-light rounded mt-4">
        <h1 className="display-4 fw-bold mb-3">Benvenuto sul sito ufficiale della Summer Season!</h1>
        <p className="lead mb-4">
          Partecipa a sfide, accumula punti e scala la classifica! Unisciti alle leghe, completa le sfide e diventa il migliore.
        </p>
      </div>

      <div className="container py-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Classifica</h5>
                <p className="card-text">
                  Controlla la tua posizione e confrontati con altri partecipanti nelle varie leghe.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Leghe</h5>
                <p className="card-text">
                  Partecipa a leghe pubbliche o private, collabora con i membri e accumula punti insieme al tuo team.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Sfide</h5>
                <p className="card-text">
                  Completa sfide giornaliere o settimanali, guadagna punti e sali in classifica!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
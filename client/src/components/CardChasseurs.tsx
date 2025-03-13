import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles (anciennement CSS)/pages/CardChasseurs.css";
import PhotoDeleteForm from "./PhotoDeleteForm";

type PhotoType = {
  id: number;
  title: string;
  content: string;
  artist: string;
  dateoftheday: string;
  latitude: number;
  longitude: number;
  picture: string | null;
};

function CardChasseurs() {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [, setSelectedPhoto] = useState<PhotoType | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/photos`)
      .then((responseData) => responseData.json())
      .then((photos) => {
        setPhotos(photos);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  }, []);

  const handleDelete = (photoId: number, toastId: React.ReactText) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/photos/${photoId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setPhotos((prevPhotos) =>
            prevPhotos.filter((photo) => photo.id !== photoId),
          );
          toast.success("Photo supprimée avec succès !");
        } else {
          toast.error("Échec de la suppression de la photo.");
        }
      })
      .catch((error) => {
        toast.error("Erreur lors de la suppression de la photo.");
        console.error("Error deleting photo:", error);
      })
      .finally(() => {
        toast.dismiss(toastId); // Ferme le toast après l'action
      });
  };

  const confirmDelete = (photoId: number) => {
    const toastId = toast.warn(
      <div>
        <p>Êtes-vous sûr·e de vouloir supprimer cette photo ?</p>
        <button
          type="button"
          onClick={() => handleDelete(photoId, toastId)}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Oui, supprimer
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  return (
    <>
      <section className="carte-photo">
        <h1 className="liste-streetArt">LES ŒUVRES STREET ART</h1>
        <div className="cards_grid">
          {photos.map((photo) => (
            <section className="streetArtPhotos" key={photo.id}>
              <h2 className="titre-photo">{photo.title}</h2>
              <button
                type="button"
                className="image-container"
                onClick={() => setSelectedPhoto(photo)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setSelectedPhoto(photo);
                  }
                }}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/photos/${photo.picture || "default-picture.jpg"}`}
                  alt={photo.title}
                />
              </button>
              <p className="artist_content">{photo.artist}</p>
              <p className="photo_content">{photo.content}</p>
              <div className="delete_photo_content">
                <p className="date_content">{photo.dateoftheday}</p>
                <PhotoDeleteForm
                  onSubmit={(event) => event.preventDefault()}
                  id={0}
                >
                  <button
                    type="button"
                    className="delete-photo-button"
                    onClick={() => confirmDelete(photo.id)}
                  >
                    Supprimer
                  </button>
                </PhotoDeleteForm>
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

export default CardChasseurs;

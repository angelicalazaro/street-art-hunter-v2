import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import de Toastify
import "react-toastify/dist/ReactToastify.css"; // Import du CSS de Toastify
import SubmitPhotoForm from "../Photos/SubmitPhotoForm";

// Interface définissant les données d'une photo à soumettre
interface PhotoData {
  title: string;
  artist: string;
  content: string;
  dateoftheday: string;
  picture: File | null;
}

function UploadPhoto() {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const newPhoto: PhotoData = {
    title: "",
    artist: "",
    content: "",
    dateoftheday: "",
    picture: null,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setGeoError("Permission denied. Using default coordinates.");
          }
        },
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSubmit = (photoData: FormData) => {
    const formattedDate = new Date().toLocaleDateString("fr-FR");

    if (latitude && longitude) {
      photoData.append("latitude", latitude.toString());
      photoData.append("longitude", longitude.toString());
    }
    photoData.append("dateoftheday", formattedDate);

    fetch(`${import.meta.env.VITE_API_URL}/api/photos`, {
      method: "POST",
      body: photoData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
          // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
          throw new Error("Erreur lors de l'envoi de la photo.");
        }
      })
      .then(() => {
        // ✅ Toast de succès après soumission réussie
        toast.success("Photo envoyée avec succès !", {
          position: "top-right",
          autoClose: 3000,
        });

        // ✅ Ajout d'un délai avant la redirection pour que le toast s'affiche
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error submitting photo:", error);
        // ❌ Toast d'erreur si l'envoi échoue
        toast.error("Échec de l'envoi de la photo. Veuillez réessayer.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  return (
    <>
      <div>
        <ToastContainer position="bottom-left" />
        {geoError && <p>{geoError}</p>}
        <SubmitPhotoForm defaultValue={newPhoto} onSubmit={handleSubmit} />
      </div>
    </>
  );
}

export default UploadPhoto;

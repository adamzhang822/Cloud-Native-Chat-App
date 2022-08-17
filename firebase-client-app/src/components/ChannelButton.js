import { useState, useEffect, React } from "react";
import "../App.css";
import { db, firebaseAuth } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const ChannelButton = (props) => {
  const { id, name, changeChannel } = props;
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const checkIsNew = async () => {
      const { uid } = firebaseAuth.currentUser;
      const docRef = doc(db, "users", uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const visited = data.visited;
          if (!visited || !visited.includes(id)) {
            setIsNew(true);
          } else {
            setIsNew(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    try {
      checkIsNew();
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  return (
    <div>
      {name} {isNew && <p>(New!)</p>}
      <button
        onClick={() => {
          changeChannel(id);
          setIsNew(false);
        }}
      >
        Get in
      </button>
    </div>
  );
};

export default ChannelButton;

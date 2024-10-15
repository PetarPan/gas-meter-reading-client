//otvaranje zatvaranje obracuna
//brisanje stare baze trasa
//eksport .csv 
//eksport cele baze pre brisanja
//novo stanje manje od starog
//import nove baze!!!
//linkovi ka kreiranju citaca i trasa (update vrednosti)
//
import React, { useState } from 'react'

function AdminPage() {

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
    }

  return (
    <>
    <div>
      Admin Page
      <ul>
        <h3>Komponente za Admina</h3>
        <li>Lista trasa, dodavanje i brisanje</li>
        <li>Lista citaca, dodavanje i brisanje</li>
        <li>Dugme uvoz nove baze, trasa</li>
        <li>Dugme popunjavanje baza trasa iz gornjeg uvoza</li>
        <li>Dugme brisanje podataka iz baza trasa</li>
        <li>Tabelarni prikaz svih trasa, sort i filter svih kolona uz dugme za eksport u .csv</li>
      </ul>
    </div>


<div>
<div>
            <h2>Admin Page</h2>
            <input type="file" accept=".xls,.xlsx" onClick={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
</div>
</>
  )
}

export default AdminPage;

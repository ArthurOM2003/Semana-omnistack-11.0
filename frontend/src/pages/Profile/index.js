import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg'
import './styles.css'

export default function Profile(){
    const [incidents, setIncidents] = useState([]);

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');
    
    const history = useHistory();

    useEffect(()=> {
        api.get('Profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

   async function handleDeleteIncident(id){
        try{
            await api.delete(`incidents/${id}`, {
                headers:{
                    Authorization: ongId,
                }
            })

            setIncidents(incidents.filter(incident => incident.id!==id));

        }   catch(err){
            alert('erro ao deletar caso, tente novamente');
        }
    }

        function handleLogout(){
            localStorage.clear();

            history.push('/')
        }

    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem vindo(a), {ongName}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button type="button">
                    <FiPower onClick={handleLogout} size={18} color="#E02041"></FiPower>
                </button>
                    
            </header>
            <h1>Casos Cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>
                    
                    <strong>desc:</strong>
                    <p>{incident.description}</p>
                    
                    <strong>vlr</strong>
                    <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                    <button onClick={() => handleDeleteIncident(incident.id)} type="button" >
                        <FiTrash2 size={20} color="#a8a8b3"></FiTrash2>
                    </button>
                </li>
                ))}
            </ul>
            
        </div>
    );
}
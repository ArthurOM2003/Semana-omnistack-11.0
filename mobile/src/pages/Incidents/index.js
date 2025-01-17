import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {Feather} from '@expo/vector-icons';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Incidents(){
    const [incidents, setIncidents] = useState([]);
    const navigation = useNavigation();

    const [total,setTotal] = useState(0);
    const [page, setpage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident){
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents(){
        if(loading){
            return;
        }
        if(total>0 && incidents.length === total){
            return;
        }

        setLoading(true);

        const response = await api.get('incidents',{
            params: {page}
        });

        
        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setLoading(false);
        setpage(page + 1);
        
    }

    useEffect(()=> {
        loadIncidents();
    }, [])


    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos.</Text>
                </Text>
            </View>
            <Text style={styles.title}>Bem vindo</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo</Text>
                <FlatList  style={styles.IncidentList}
                data={incidents}
                keyExtractor={incident=> String(incident.id)}
                //showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident }) => (
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>
                    
                        <Text style={styles.incidentProperty}>cstat-no:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>
                   
                        <Text style={styles.incidentProperty}>Valor:</Text>
                        <Text style={styles.incidentValue}>
                            {Intl.NumberFormat('pt-BR', {
                                style: 'currency', 
                                currency: 'BRL'
                                }).format(incident.value)}
                        </Text>

                        <TouchableOpacity style={styles.detailsButton} 
                        onPress={() => navigateToDetail(incident)}>
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041"/>
                        </TouchableOpacity>
                    </View>
                )}
                />
        </View>
    );
}
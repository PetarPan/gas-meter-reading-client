import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from "react-helmet-async";
import NewsSt from '../styledComponents/NewsSt.style'

function NewsView() {
    const [news, setNews] = useState([]);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(apiUrl + `/news`)

            .then((response) => {
                const sortedNews = response.data.sort((a, b) => b.id - a.id);
                setNews(sortedNews);
            })
            .catch((error) => {
                console.error('Greška prilikom prikaza vesti:', error);
            });
    }, [apiUrl]);

    return (
        <HelmetProvider>
            <Helmet>
                <title>Početna strana GMR</title>
            </Helmet>
            <NewsSt>

                {news.map((newsItem) => {
                    return (
                        <div key={newsItem.id} className='news-container'>
                            <p className='news-title'>{newsItem.newsTitle}</p>
                            <p className='news-body'>{newsItem.newsBody}</p>
                            <p className='news-body'>Datum objave vesti: {newsItem.updatedAt.slice(0, 10)}</p>
                        </div>
                    );
                })}
            </NewsSt>
        </HelmetProvider>


    )
}

export default NewsView

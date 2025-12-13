import React from 'react';
import {Card, Image, Rating, Icon} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const post_url = `https://image.tmdb.org/t/p/w342`;

const MovieCard = (props) => 
    <Card>
        <Card.Content>
            <Image src={`${post_url}${props.movie.poster_path}`} 
            onClick={props.handleClick}
            style={{ 
            width: '100%',
            height: 'auto',
            marginBottom: '8px',
            objectFit: 'contain',
            display: 'block' }}/>
            <Card.Header style={{ marginTop: '8px' }}>{props.movie.title}</Card.Header>
            <Card.Meta style={{ marginTop: '4px' }}>
                {props.movie.release_date.slice(0,4)}
            </Card.Meta>
        </Card.Content>    
        <Card.Content extra>
            <Rating  maxRating={5} defaultRating={props.movie.vote_average/2} disabled/>
        </Card.Content>
    </Card>

export default MovieCard;

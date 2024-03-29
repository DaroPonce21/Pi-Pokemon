import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPokemones, getTypes, filterPokemonType, filterPokemonOrigin, orderByName, orderByStrength, cleanFilters, cleanSearchPokemon } from "../redux/actions/actions.js"
import { Cards } from "./cards.jsx";
import { Loader } from "./loader.jsx";
import { Paginado } from "./paginado.jsx";
import { SearchBar } from "./searchBar.jsx";
import "../stylos/home.css";
export const Home = () =>{

    const dispatch = useDispatch();
    const types = useSelector(state => state.types);
    const pokemones = useSelector(state => state.pokemones);
    const pokemonesFiltered = useSelector(state => state.pokemonesFiltered);
    const pokemonesSearch = useSelector(state => state.pokemonesSearch);
    const [filter, setFilter] = useState(false);
    const [pokemonesRender, setPokemonesRender] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pokemonsPerPage] = useState(12);
    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    let currentPokemon = []
    var allPokemons = [];

    
    if(filter === false){
        allPokemons = pokemonesRender.pokemones ? pokemonesRender.pokemones : []
        if(currentPage === 1){
            currentPokemon = pokemonesRender.pokemones?.slice(0,12)
        }else{
            currentPokemon = pokemonesRender.pokemones?.slice(indexOfFirstPokemon, indexOfLastPokemon);
        }
    }else if(pokemonesFiltered.length > 0){
        allPokemons = pokemonesRender.pokemonesFiltered ? pokemonesRender.pokemonesFiltered : []

        if(currentPage === 1){
            currentPokemon = pokemonesRender.pokemonesFiltered?.slice(0,12)
        }else{
            currentPokemon = pokemonesRender.pokemonesFiltered?.slice(indexOfFirstPokemon, indexOfLastPokemon);
        }
    }else{
        allPokemons = pokemonesRender.pokemones ? pokemonesRender.pokemones : []
        if(currentPage === 1){
            currentPokemon = pokemonesRender.pokemones?.slice(0,12)
        }else{
            currentPokemon = pokemonesRender.pokemones?.slice(indexOfFirstPokemon, indexOfLastPokemon);
        }
    }
    

    const paginado = (pageNumber) =>{
        setCurrentPage(pageNumber);
    }

    useEffect(() => {
        dispatch(getPokemones());
        dispatch(getTypes());
        return () =>{
            dispatch(cleanFilters());
            dispatch(cleanSearchPokemon());
        }
       }, [dispatch]);

     useEffect(()=>{
         setPokemonesRender({pokemones, pokemonesFiltered})
     },[pokemones, pokemonesFiltered])   
       
    

    function handleFilter(e){
        e.preventDefault();
        dispatch(cleanSearchPokemon());
        dispatch(filterPokemonOrigin(e.target.origen.value));
        dispatch(filterPokemonType(e.target.type.value));
        setFilter(true)
    }

     function handleOrderName(e){
         dispatch(orderByName(e.target.value));
         setPokemonesRender({pokemones, pokemonesFiltered});
    }

    function handleOrderStrength(e){
        dispatch(orderByStrength(e.target.value));
        setPokemonesRender({pokemones, pokemonesFiltered});
    }

  
    
    
    const validatePokemonsForCards = () => {
        
        if(filter === true && pokemonesFiltered.length === 0){
            return(<>
            <span className='noEncontrados'>No se han encontrado pokemones con los filtros seleccionados</span>
            <div className="paginado"><Paginado pokemonsPerPage={pokemonsPerPage} allPokemons={allPokemons.length} paginado={paginado}/></div>
            <Cards pokemones={currentPokemon}/>
            </>)
        }else if(filter === true && pokemonesFiltered.length > 0){
            return(<>
                <div className="paginado"><Paginado pokemonsPerPage={pokemonsPerPage} allPokemons={allPokemons.length-9} paginado={paginado}/></div>
                <Cards pokemones={currentPokemon}/>
                </>)
        }else if(pokemonesSearch.length > 0 && typeof(pokemonesSearch[0]) == 'string'){
            return(<>
            <div className="paginado"><Paginado pokemonsPerPage={pokemonsPerPage} allPokemons={allPokemons.length-9} paginado={paginado}/></div>
                  <span className='noEncontrados'>No se han encontrado pokemones con el nombre ingresado</span>
                <Cards pokemones={currentPokemon}/>
                </>)
        }else if(pokemonesSearch.length > 0 && typeof(pokemonesSearch[0]) !== 'string'){
            return(<>
                <Cards pokemones={pokemonesSearch}/>
            </>)
        }else{
            return(<>
            <div className="paginado"><Paginado pokemonsPerPage={pokemonsPerPage} allPokemons={allPokemons.length-9} paginado={paginado}/></div>
                <Cards pokemones={currentPokemon}/>
                </>)
        }
        
    }

    return(
        <>
        {pokemones.length > 0 ? <>
        <nav className='nav'>
        <Link to='/' className='linkHome'>
        <span>Inicio</span> 
        </Link>   
        <SearchBar setFilter={setFilter}/>
        </nav>
        
        <div className='conteiner'>
        <form onSubmit={(e) => handleFilter(e)} className='filtrosConteiner'>
            <div>
        <label>Filtrar por Origen:</label>
        <select className='select' name="origen" id="origen">
            <option value='todos' className='option'>Todos</option>
            <option value='api' className='option'>Pokemones API</option>
            <option value='bd' className='option'>Pokemones BD</option>
        </select>
        </div>
        <div>
        <label>Filtrar por Tipo:</label>
        <select className='select' name="type" id="type">
            <option value='todosTipo'>Todos</option>
            {types?.map(tipo => <option value={tipo.name} key={tipo.id}>{tipo.name}</option>)}
        </select>
        </div>
        <input type='submit' value='Filtrar' className='btn'/>
        </form>
        <div className='ordenConteiner'>
            <div>
                <label>Ordenar por Fuerza:</label>
                <select className='select' name="fuerza" id="fuerza" onChange={(e) => handleOrderStrength(e)}>
                    <option value='asc'>Ascendente</option>
                    <option value='dsc'>Descendente</option>
                </select>
            </div>
            <div>
                <label>Ordenar por Nombre:</label>
                <select className='select' name="nombre" id="nombre" onChange={(e) => handleOrderName(e)}>
                    <option value='asc'>Ascendente</option>
                    <option value='dsc'>Descendente</option>
                </select>
            </div>
        </div>
        </div>
        <Link to='/create' className='linkCrearPokemon'>
            <button className='crearPokemon'>Crear Pokemon</button>
        </Link>
        
        {validatePokemonsForCards()}
        </> : <Loader/>}
        
        
        </>
    )   
}
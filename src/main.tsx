import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { artworkStore } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './artwork_excerpts.css';
import { ArtworkExcerptsApp } from './ArtworkExcerptsApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode><Provider store={artworkStore}><BrowserRouter><ArtworkExcerptsApp /></BrowserRouter></Provider></StrictMode>,
);

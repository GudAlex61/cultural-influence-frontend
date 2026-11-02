import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './artwork_excerpts.css';
import { ArtworkExcerptsApp } from './ArtworkExcerptsApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter><ArtworkExcerptsApp /></BrowserRouter></StrictMode>,
);

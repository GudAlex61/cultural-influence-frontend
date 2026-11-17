import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

export const useArtworkDispatch = useDispatch.withTypes<AppDispatch>();
export const useArtworkSelector = useSelector.withTypes<RootState>();

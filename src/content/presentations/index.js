import { introductionPresentations } from './01-introduction.js';
import { measurementPresentations } from './02-measurement.js';
import { shapeSortingPresentations } from './03-shape-sorting.js';
import { farmerMissionPresentations } from './04-farmer-missions.js';
import { shapeDesignerPresentations } from './05-shape-designer.js';
import { summaryPresentations } from './06-summary.js';

export const presentations = {
    ...introductionPresentations,
    ...measurementPresentations,
    ...shapeSortingPresentations,
    ...farmerMissionPresentations,
    ...shapeDesignerPresentations,
    ...summaryPresentations
};
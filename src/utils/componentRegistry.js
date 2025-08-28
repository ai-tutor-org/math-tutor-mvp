// Component registry for mapping interaction types to components

// ===== Presentation Components (Right Side Content) =====
import RoomIllustration from '../components/presentations/01-introduction/RoomIllustration';
import StandardUnits from '../components/presentations/01-introduction/StandardUnits';
import RulerMeasurement from '../components/presentations/01-introduction/RulerMeasurement';
import MeterStick from '../components/presentations/01-introduction/MeterStick';
import ShapeSorterGame from '../components/presentations/03-shape-sorting/ShapeSorterGame';
import MissionReadiness from '../components/presentations/04-farmer-missions/MissionReadiness';
import FarmerIntro from '../components/presentations/04-farmer-missions/FarmerIntro';
import FoxThreat from '../components/presentations/04-farmer-missions/FoxThreat';
import FarmMap from '../components/presentations/04-farmer-missions/FarmMap';
import PerimeterDefinition from '../components/presentations/04-farmer-missions/PerimeterDefinition';
import RectangleSolution from '../components/presentations/04-farmer-missions/RectangleSolution';
import ShapeDesigner from '../components/presentations/05-shape-designer/ShapeDesigner';

// ===== UI Interface Components (Left Side Controls) =====
import PerimeterInputInterface from '../components/lesson/InteractiveUI/interfaces/PerimeterInputInterface';
import ShapeDesignInterface from '../components/lesson/InteractiveUI/interfaces/ShapeDesignInterface';
import MeasurementInterface from '../components/lesson/InteractiveUI/interfaces/MeasurementInterface';
import MultipleChoiceInterface from '../components/lesson/InteractiveUI/interfaces/MultipleChoiceInterface';
import ActionButton from '../components/lesson/InteractiveUI/interfaces/ActionButton';

// Presentation components for main content area (right side)
export const componentMap = {
    'room-question': RoomIllustration,
    'footsteps-animation': RoomIllustration,
    'footsteps-animation-friend': RoomIllustration,
    'conflicting-measurements': RoomIllustration,
    'standard-units-explanation': StandardUnits,
    'ruler-measurement': RulerMeasurement,
    'meter-measurement': MeterStick,
    'multiple-choice-question': RoomIllustration,
    'tutor-monologue': RoomIllustration,
    'shape-sorting-game': ShapeSorterGame,
    'mission-readiness': MissionReadiness,
    'farmer-intro': FarmerIntro,
    'fox-threat': FoxThreat,
    'farm-map': FarmMap,
    'perimeter-definition': PerimeterDefinition,
    'perimeter-input': FarmMap,
    'rectangle-solution': RectangleSolution,
    'shape-designer': ShapeDesigner
};

// UI Interface components for user input controls (left side)
export const uiInterfaceMap = {
    'perimeter-input': {
        component: PerimeterInputInterface,
        hookKey: 'perimeterHook',
        handlerKey: 'onPerimeterCheck',
        category: 'input'
    },
    'perimeter-design': {
        component: ShapeDesignInterface,
        hookKey: 'shapeDesignHook',
        handlerKey: 'onShapeDesignCheck',
        category: 'design'
    },
    'shape-measurement': {
        component: MeasurementInterface,
        hookKey: 'measurementHook',
        handlerKey: 'onMeasurementCheck',
        category: 'input'
    },
    'multiple-choice-question': {
        component: MultipleChoiceInterface,
        handlerKey: 'onAnswer',
        category: 'quiz'
    }
    // Note: action-button is handled separately as it's always shown with showNextButton
    // Future lessons can add their UI interfaces here:
    // 'fraction-input': {
    //     component: FractionInputInterface,
    //     hookKey: 'fractionHook',
    //     handlerKey: 'onFractionCheck',
    //     category: 'input'
    // }
};

// Helper functions for UI interface components
export function getUIInterface(interactionType) {
    return uiInterfaceMap[interactionType];
}

export function hasUIInterface(interactionType) {
    return interactionType in uiInterfaceMap;
}
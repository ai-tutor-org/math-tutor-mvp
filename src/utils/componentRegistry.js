// Component registry for mapping interaction types to components
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
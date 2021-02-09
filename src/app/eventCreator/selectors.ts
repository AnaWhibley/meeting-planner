import {RootState} from '../store';
import {ParticipantType} from './slice';

export const selectStage = (state: RootState) => state.eventCreator.stage;
export const selectGroupName = (state: RootState) => state.eventCreator.groupName;
export const selectEvents = (state: RootState) => state.eventCreator.events;
export const selectParticipants = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].participants;
export const selectName = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].name;
export const selectDuration = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].duration;
export const selectFrom = (state: RootState) => state.eventCreator.from;
export const selectTo = (state: RootState) => state.eventCreator.to;
export const selectIsSummaryStage = (state: RootState) => state.eventCreator.stage === 3;
export const selectIsConfirmationStage = (state: RootState) => state.eventCreator.stage === 4;
export const selectIsStageOne = (state: RootState) => state.eventCreator.stage === 0;
export const selectTutorNumber = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].participants.reduce((acc, current) => {
    let newAcc = acc;
    if(current.tag === ParticipantType.TUTOR) newAcc += 1;
    return newAcc;
}, 0);
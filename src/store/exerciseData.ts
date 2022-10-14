import { defineStore } from "pinia";
import {exerciseApi} from "@/api/exercises"
import {ExerciseCycle} from "@/store/createRoutine";
import { RoutinesApi } from "@/api/routines";
import { CyclesApi } from "@/api/cycles";
import {Routine} from "@/api/routines";

const ROUTINE_ID ='ROUTINE-ID';
interface Exercise {
     name: string | undefined;
     cycleId: number ;
     exerciseCycle:ExerciseCycle;
     weight: number  | undefined;
     sets: number  | undefined;
     id : number;
     indexId:number;
}
interface ExerciseAPiType{
    name:string | undefined;
    detail: string|undefined;
    type: 'exercise';
    id:number;
    metadata: any;

}
export {ExerciseAPiType,Exercise}
export const useExerciseStore = defineStore('exercises', {

    state: () => ({
        exercisArray: [] as editExerciseObj [],
        createdExercise:[] as ExerciseAPiType[],
        cycleIds:[0,1,2],
        orderCycles:[1,1,1],
        routineName:'',
        routineDetail:'',
        routineId:0,
        id:0
    }),
    getters: {

        getCoolDownExercise(state){
            return this.exercisArray.filter(ex=>ex.cycleId === this.cycleIds[2]);
        },
        getMainSetExercises(state){
            return this.exercisArray.filter(ex=>ex.cycleId === this.cycleIds[1]);
        },
        getWarmUpExercises(state){
            return this.exercisArray.filter(ex=>ex.cycleId === this.cycleIds[0]);
        },


    },
    actions: {
        deleteExercise(id:number){
            const aux= this.exercisArray.findIndex(ex => ex.indexId === id);
            if(aux !== undefined)
             this.exercisArray.splice(aux,1);
            console.log(this.exercisArray.length)
        },
        updateName(id:number,ex_name:string){
            const aux= this.exercisArray.findIndex(ex => ex.indexId === id);

            if(aux === undefined)
                return;
            //his.exercisArray[aux].exercise.name = ex_name;
        },
        updateTime(id:number,time:number){
            const aux= this.exercisArray.findIndex(ex => ex.indexId === id);

            if(aux === undefined)
                return;
            this.exercisArray[aux].exerciseInCycle.duration  = time;
        },
        updateWeight(id:number,weight:number){
            const aux= this.exercisArray.findIndex(ex => ex.indexId === id);

            if(aux === undefined)
                return;
            this.exercisArray[aux].exerciseInCycle.repetitions  = weight;
        },
        updateReps(id:number,reps:number){
            const aux= this.exercisArray.findIndex(ex => ex.indexId === id);

            if(aux === undefined)
                return;
            this.exercisArray[aux].exerciseInCycle.repetitions  = reps;
        },
        updateSets(id:number,sets:number){
            const aux= this.exercisArray.findIndex(ex => ex.indexId === id);

            if(aux === undefined)
                return;
            this.exercisArray[aux].exerciseInCycle.repetitions = sets;
        },
        async uploadExercises(exercise : ExerciseAPiType,cicleId : number,indexId:number){
            const index =this.createdExercise.findIndex(ex => ex.name === exercise.name);
            console.log(this.createdExercise);
            if (index === -1) {
                const idAux = await exerciseApi.uploadExercises(exercise);
                this.exercisArray.push(new editExerciseObj(this.id++,this.cycleIds[cicleId],idAux,new ExerciseCycle(0,0,0),false));
                await this.getCreatedExercises();
            }else{
                console.log(this.cycleIds[cicleId]);
                this.exercisArray.push(new editExerciseObj(this.id++,this.cycleIds[cicleId],this.createdExercise[index],new ExerciseCycle(0,0,0),false));
            }
        },
         async getRoutineData(){
            let id;
            if ((id = localStorage.getItem(ROUTINE_ID)) != null)
                 id = parseInt(id);
            else
                id = 0;
            const routine = await RoutinesApi.getRoutine(id);
            this.routineName = routine.name;
            this.routineDetail = routine.detail;
            console.log(this.routineDetail);
            const cycles = await RoutinesApi.getCycle(id);
            for(let y = 0; y <cycles.length; y++){
                this.cycleIds[y] = (cycles[y].id);
                const aux= await CyclesApi.getExercisesCycle(cycles[y].id);
                for (let x = 0; x < aux.content.length ; x++){
                    this.exercisArray.push(new editExerciseObj(this.id++,this.cycleIds[y],aux.content[x].exercise,new ExerciseCycle(aux.content[x].order,aux.content[x].duration,aux.content[x].repetitions),true));
                }
            }
         },


        async updateExercises(exercise: ExerciseAPiType, exerciseId: number) {
            exerciseApi.updateExercises(exerciseId, exercise);
        },
        async deleteExercises(exerciseId: number) {
            exerciseApi.deleteExercises(exerciseId);
        },
        async getCreatedExercises(){
            this.createdExercise = await exerciseApi.getExercises();
        },
        setOrder(index:any){
            const aux = this.cycleIds.findIndex(ex => ex=== this.exercisArray[index].cycleId);
            this.exercisArray[index].exerciseInCycle.order = this.orderCycles[aux]++;
        },
        deleteAll(){
            this.orderCycles = [1,1,1];
            this.exercisArray= [];
            this.cycleIds =[];
            this.createdExercise = [];
        },
        setRoutine(name:string,detail:string){
            this.routineName = name;
            this.routineDetail = detail;
        },
       async createRoutine(){
            const response = await RoutinesApi.addRoutine(new Routine(this.routineName,this.routineDetail,"rookie",true));
            this.routineId = response.id;
            this.setId(this.routineId);
            let response2 =  await RoutinesApi.addCycle(this.routineId,"warmup","warmup","warmup",1,1 );
            this.cycleIds[0] = (response2.id);
            response2 =  await RoutinesApi.addCycle(this.routineId,"mainset","exercise","exercise",2,1 );
            this.cycleIds[1]=(response2.id);
            response2 =  await RoutinesApi.addCycle(this.routineId,"cooldown","cooldown","cooldown",3,1 );
            this.cycleIds[2]=(response2.id);

        },
        setId(id:number){
            localStorage.setItem(ROUTINE_ID,id.toString());
        },
      async addExercisesToRoutine(){
        for (const ex in this.exercisArray){
          this.setOrder(ex);
          if (this.exercisArray[ex].newExercise) {
            await CyclesApi.changeExercise(this.exercisArray[ex].cycleId, this.exercisArray[ex].exercise.id, this.exercisArray[ex].exerciseInCycle);
          }
          else {
            await CyclesApi.addExercise(this.exercisArray[ex].cycleId, this.exercisArray[ex].exercise.id, this.exercisArray[ex].exerciseInCycle);
            this.exercisArray[ex].newExercise = true;
          }
        }
      }
    }

})
class editExerciseObj{
    exercise: any;
    indexId:number;
    cycleId:number;
    newExercise:boolean;
    exerciseInCycle:ExerciseCycle
    constructor(indexId:number,cycleId:number,exercise:any,exerciseInCycle:ExerciseCycle,newExercise:boolean) {
        this.cycleId=cycleId;
        this.indexId=indexId;
        this.exercise = exercise;
        this.exerciseInCycle = exerciseInCycle;
        this.newExercise = newExercise;
    }

}
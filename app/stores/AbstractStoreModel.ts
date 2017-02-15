// import * as alt from 'alt';

//abstract class with no implementation - moving to be included in Alt 0.17 release
class AbstractStoreModel<S> implements AltJS.StoreModel<S> {
	bindActions:( ...actions:Array<Object>) => void;
	bindAction:( ...args:Array<any>) => void;
	bindListeners:(obj:any)=> void;
	exportPublicMethods:(config:{[key:string]:(...args:Array<any>) => any}) => any;
	exportAsync:( source:any) => void;
	waitFor:any;
	exportConfig:any;
	getState:() => S;
}

export default AbstractStoreModel;
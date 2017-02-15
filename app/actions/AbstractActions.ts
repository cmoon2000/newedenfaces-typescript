class AbstractActions implements AltJS.ActionsClass {
  constructor(){}
  actions:any;
  dispatch: ( ...payload:Array<any>) => void;
  generateActions:( ...actions:Array<string>) => void;
}

export default AbstractActions;
// For methods on e.g. $('a')
interface JQuery {
  magnificPopup(callback?: () => void): JQuery;
  magnificPopup(obj: any): JQuery;
}

// For methods on $
interface JQueryStatic {
  magnificPopup: JQueryMagnificPopupStatic;
}

interface JQueryMagnificPopupStatic {
  open: any;
  (): JQuery;
  parameter(name: string): string;
  parameter(name: string, value: string, append?: boolean): JQuery;
}
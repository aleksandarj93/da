export class ChosenDomain {
  domainParam: string;
  isChosen: boolean;

  constructor(domainParam: string, isChosen: boolean) {
    this.domainParam =domainParam;
    this.isChosen = isChosen;
  }
}
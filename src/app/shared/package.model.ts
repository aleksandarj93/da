
export class Package {
  name: string;
  alocated: number;
  used: number;
  status: boolean;

  constructor(name?: string, alocated?: number, used?: number, status?: boolean) {
    this.name = name;
    this.alocated = alocated;
    this.used = used;
    this.status = status;
  }

  public static extractAllPackages(stringPackageList: Array<string>): Array<Package> {
    var packages: Array<Package> = new Array<Package>();
    if (typeof stringPackageList === 'string') {
      var list: Array<string> = String(stringPackageList).split(':');
      var status: boolean = false;
      if (Number(list[1]) > Number(list[2])) {
        status = true;
      }
      var p = new Package(list[0], Number(list[1]), Number(list[2]), status);
      packages.push(p);
    }
    else {
      stringPackageList.forEach(element => {
        var list: Array<string> = element.split(':');
        var status: boolean = false;
        if (Number(list[1]) > Number(list[2])) {
          status = true;
        }
        var p = new Package(list[0], Number(list[1]), Number(list[2]), status);
        packages.push(p);
      });
    }
    return packages;
  }

  public static convertPackagesToStringList(allPackages: Array<Package>): Array<string> {
    var stringList = Array<string>();
    allPackages.forEach(element => {
      var string = element.name + ":" + element.alocated.toString() + ":" + element.used.toString();
      stringList.push(string);
    });
    console.log("convertPackagesToStringList    string lista      " + stringList)
    return stringList;
  }

}
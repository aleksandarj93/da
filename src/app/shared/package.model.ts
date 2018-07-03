
export class Package {
    name: string;
    alocated: number;
    used: number;
    status: boolean;

    constructor(name?: string, alocated?: number, used?: number, status?: boolean ) {
        this.name = name;
        this.alocated = alocated;
        this.used = used;
        this.status = status;
    }

    
  // Metoda kao ulazni parametar prima listu stringova u formatu: "paket:broj alociranih:broj potrosenih"
  //na osnovu tih stringova prave se paketi, pakektu se dodeljuje status = true (moguce ga je dodeliti novom korisniku)
  // ako je broj alociranih veci od broja potrosenih
  public static extractAllPackages(stringPackageList: Array<string>): Array<Package> {
    var packages: Array<Package> = new Array<Package>();
    stringPackageList.forEach(element => {
      var list: Array<string> = element.split(':');
      var status: boolean = false;
      if (Number(list[1]) > Number(list[2]))  {
        status = true;
      }
      var p = new Package(list[0], Number(list[1]), Number(list[2]), status);
      packages.push(p);
    });
    return packages;
  }

    // Metoda koja dobija listu svih paketa koji su update-ovani za + 1 used, za izabrani paket
  // i konvertuje ih u niz stringova
  public static convertPackagesToStringList(allPackages: Array<Package>): Array<string>{
    var stringList = Array<string>();
    allPackages.forEach(element => {
      var string = element.name + ":" + element.alocated.toString() + ":" + element.used.toString();
      stringList.push(string);
    });
    console.log("convertPackagesToStringList    string lista      " + stringList)
    return stringList;
  }

}
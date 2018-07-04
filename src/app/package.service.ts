import { Injectable } from '@angular/core';
import { UserServiceService } from './user-service.service';
import { Package } from './shared/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private _userService: UserServiceService) { }

  private delay(ms: number): Promise<void> {
    return new Promise<void>(resolve =>
      setTimeout(resolve, ms));
  }

  async getPackageStringList(): Promise<Array<string>> {
    let response;
    try {
      response = await this._userService.getMailDomain();
    } catch (error) {
    }
    return response.ldapSearch[0].sunAvailableServices;
  }

  getAllPackagesObjs(packageStringList: Array<string>): Array<Package> {
    var allPackages = new Array<Package>();
    allPackages = Package.extractAllPackages(packageStringList);
    return allPackages;
  }

  getAvailablePackagesObjs(allPackages: Array<Package>): Array<Package> {
    var availablePackages = new Array<Package>();
    allPackages.forEach(element => {
      if (element.status) {
        availablePackages.push(element);
      }
    });
    return availablePackages;
  }

  // Ako je user kreiran i dodeljen mu je paket, za izabrani paket dodaje se + 1 za used atribut
  // i poziva se metoda convertPackagesToStringList().
  updatePackageListString(serviceStatus: string, selectedPackage: Package, allPackages: Array<Package>, action: string): Array<string> {

    if (serviceStatus == 'SUCCESS' && selectedPackage != null) {
      allPackages.forEach(element => {
        if (element.name == selectedPackage.name) {
          if (action == 'create') { element.used = element.used + 1; }
          else if (action == 'delete') { element.used = element.used - 1; }

        }
      });
      console.log("NOVA LISTA PAKETA +++++" + Package.convertPackagesToStringList(allPackages))
      return Package.convertPackagesToStringList(allPackages);
    }
  }

  async modifySunAvailableServices(packageStringList: Array<string>): Promise<any> {
    var object = {};
    var modifications = [];
    var values = [];

    packageStringList.forEach(element => {
      values.push({ "value": element });
    });

    modifications.push({ "type": "replace", "name": "sunAvailableServices", "values": values });
    object = { "dn": "o=domen1.rs,o=isp", "modifications": modifications };
    console.log("modifySunAvailableServices   object      " + object);

    let response;
    try {
      response = await this._userService.modifySunAvailableServices(object);
    } catch (error) {
    }
    return response;
  }

  findSelectedPackage(packageName: string, allPackages: Array<Package>): Package {
  for (const iterator of allPackages) {
    if(iterator.name == packageName) {
      return iterator;
    }
  }
    return undefined;
  }
}

export class BuildJSObjects {

    public static createUserModifyObject(oldUser: any, newUser: any): any {
        var oldUserAttr: Array<string> = Object.keys(oldUser);
        var newUserAttr: Array<string> = Object.keys(newUser);

        let intersection = oldUserAttr.filter(x => newUserAttr.includes(x));
        let difference = newUserAttr.filter(x => !oldUserAttr.includes(x));

        var object = {};
        var modifications = [];

        for (const x of intersection) {
            if (oldUser[x] != newUser[x]) {
                let values = [];
                values.push({ "value": newUser[x] });
                modifications.push({ "type": "replace", "name": x, "values": values });
            }
        }

        for (const y of difference) {
            let values = [];
            values.push({ "value": newUser[y] });
            modifications.push({ "type": "add", "name": y, "values": values });
        }
        object = { "dn": newUser.dn, "modifications": modifications };
        console.log(object);
       return object;

    }
}

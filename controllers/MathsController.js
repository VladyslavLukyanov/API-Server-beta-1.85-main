import MathsModel from "../models/maths.js";
import Repository from "../models/repository.js";
import Controller from "./Controller.js";

export default class MathsController extends Controller {
  constructor(HttpContext) {
    super(HttpContext, new Repository(new MathsModel()));
    this.operateurs = ["+", "-", "*", "/", "%"];
    this.operateursUnNombre = ["p", "!", "np"];
    this.resultObject = {};
    this.operationResult = null;
  }

  convertirNombres(nombre, estDecimal=false) {
    let temp = estDecimal ? parseFloat(nombre) : parseInt(nombre);
    
    return isNaN(temp) ? nombre : temp;
  }

  validerNombres(x, y) {
    if (isNaN(y) && isNaN(x)) return "x and y are invalid";
    else if (isNaN(y)) return "y is not a number";
    else if (isNaN(x)) return "x is not a number";
    else return true;
  }

  valideOperateur(operateur, unNombre=false) {
    if(operateur.valeur === " ") {
      console.log('sss');
    }
    operateur.valeur = (operateur.valeur === " " ? "+" : operateur.valeur); // si operateur est vide, "+" lui est affecté 
    console.log(operateur.valeur)
    return unNombre ? this.operateursUnNombre.includes(operateur.valeur) : this.operateurs.includes(operateur.valeur);
  }

  estNombreDecimal (nombre) {
    return nombre%1 !== 0;
  }

  faireOperation(operateur, x, y) { // a deux params
    x = this.convertirNombres(x, this.estNombreDecimal(x));
    y = this.convertirNombres(y, this.estNombreDecimal(y));
  
    const sontNombres = this.validerNombres(x,y);

    this.resultObject.op = operateur.valeur;
    this.resultObject.x = x;
    this.resultObject.y = y;

    if (this.valideOperateur(operateur)) {

      this.resultObject.op = operateur.valeur;
      
      
      if(sontNombres===true) { // peut retourner une chaine
        switch (operateur.valeur) {
          case "+":
             this.operationResult = this.somme(x, y);
             break;
          case "-":
            this.operationResult = this.soustraire(x, y);
            break;
          case "*":
            this.operationResult = this.produit(x,y);
            break;
          case "/":
            this.operationResult = this.division(x,y);
            break;
          case "%":
            this.operationResult = this.reste(x,y);
            break;
        }
        if(this.estNombreDecimal(this.operationResult))
          this.operationResult = parseFloat(this.operationResult.toFixed(2)); // garder 2 nombres apres la virgules
        this.resultObject.value = this.operationResult;
        return this.resultObject;
      } else {
        this.resultObject.value = sontNombres; // une chaine est retournée
        return this.resultObject;
      }
    } else {
      console.log("operateur invalide", operateur);
      this.resultObject.value = "operateur invalide";
      return this.resultObject;
    }
  }

  faireOperationUnNombre(operateur, n) {

    n = this.convertirNombres(n, this.estNombreDecimal(n)); 
    const estUnNombre = !isNaN(n) ? true : "n is not a number";

    this.resultObject["op"] = operateur.valeur === " "? "+" : operateur.valeur;
    this.resultObject["n"] = n;

    if(this.valideOperateur(operateur,true)) {
      console.log('operateur valide')
      if(estUnNombre===true) { // peut retourner une chaine
        console.log("n est valide");
        switch (operateur.valeur) {
          case "p" :
            this.operationResult = this.estPremier(n);
            break;

          case "!" :
            this.operationResult = this.factorielle(n);
            break;
        }
        this.resultObject.value = this.operationResult;
        return this.resultObject;
      } else {
        this.resultObject.value = estUnNombre;
      }
    } else {
      this.resultObject.value = "op n'est pas valide pour des operations avec un seul chiffre/nombre";
      return this.resultObject;
    }
    return this.resultObject;
  } 

  somme(x,y) {
    return x+y;
  }

  soustraire(x,y) {
    return x-y;
  }

  produit(x,y){
    return x*y;
  }

  division(x,y) {
    return x/y;
  }

  reste(x,y){
    return x%y;
  }

  estPremier(n) {
    if (n <= 1)
      return false;
    

    if (n <= 3)
      return true;
  
    for (let diviseur = 2; diviseur <= Math.sqrt(n); diviseur++) {
      if (n % diviseur === 0) 
        return false; 
    }
  
    return true;
  }

  nthPremier(n) {
    let cpt = 0;
    let i = 2;

    while(cpt <= n) {
       if(estPremier(i)) {
          ++cpt;
          if(cpt == n) 
            break;
       }
       ++i;
    }
    return i;
  }

  factorielle(n) {
    let fact=n;

    if(n<0)
      return "Veuillez entrer des nombres positifs";

    for (let i=n-1; i>1; --i){
      fact *= i;
    }

    return fact;
  }
}

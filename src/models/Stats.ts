export class Stats{
    private total : number;
    private spent: number;
    percent :number;
    private above90:string = '#ff0900';
    private above75 : string = '#f4511a';
    private above50 :string = '#f5dc1b';
    private above0 :string = '#00dc00';
    getSpentPercent (){
        return this.calculatePercent();
    }

    private calculatePercent(){
        this.percent= 100*(this.spent/this.total);
        return this.percent;
    }

    setSpent(value : number){
        this.spent = value;
        this.calculatePercent();
    }

    setTotal(value : number){
        this.total = value;
        this.calculatePercent;
    }

    getColor(){
        let percent = this.calculatePercent();
        let color= this.above0;
        if (percent>50)
        color = this.above50;
        if (percent>75)
        color = this.above75;
        if (percent>90)
        color = this.above90;
        return color;
    }
}
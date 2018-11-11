export class Stats {
    private total: number = 0;
    private spent: number = 0;
    percent: number = 0;
    private equal100: string = '#f02929';
    private above90: string = '#f06829';
    private above75: string = '#f09a29';
    private above50: string = '#f0d229';
    private above0: string = '#00dc00';
    getSpentPercent() {
        return this.calculatePercent();
    }

    private calculatePercent() {
        if (this.total && this.total != 0) {
            this.percent = 100 * (this.spent / this.total);
            return this.percent;
        } else {
            return 0;
        }
    }

    setSpent(value: number) {
        this.spent = value;
        this.calculatePercent();
    }

    setTotal(value: number) {
        this.total = value;
        this.calculatePercent();
    }

    getColor() {
        let percent = this.calculatePercent();
        let color = this.above0;
        if (percent > 50)
            color = this.above50;
        if (percent > 75)
            color = this.above75;
        if (percent > 90)
            color = this.above90;
        if (percent == 100)
            color = this.equal100;
        return color;
    }

}
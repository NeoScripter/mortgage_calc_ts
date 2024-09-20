export default class CalculatorHanlder {
    resultsPreview: HTMLElement | null;
    resultsPanel: HTMLElement | null;
    checkHistoryBtn: HTMLElement | null;
    hiddenPreviewClass: string;
    currency: string;

    errorHolderSelector: string;
    inputParentSelector: string;
    radioBtnErrorField: string;

    mortgageType: string;
    mortgageTypeBtns: NodeListOf<HTMLInputElement> | null;

    mortgageAmountField: HTMLInputElement | null;
    mortgageTermField: HTMLInputElement | null;
    mortgageRateField: HTMLInputElement | null;

    totalField: HTMLInputElement | null;
    monthlyField: HTMLInputElement | null;


    constructor() {
        this.resultsPreview = document.querySelector('.results__preview');
        this.resultsPanel = document.querySelector('.results__wrapper');
        this.checkHistoryBtn = document.querySelector('.calc__history-btn');
        this.hiddenPreviewClass = 'results__preview--hidden';
        this.currency = '£';

        this.errorHolderSelector = '.calc__error';
        this.inputParentSelector = '.calc__field';  
        this.radioBtnErrorField = '.calc__radio-field .calc__error';  

        this.mortgageType = '';
        this.mortgageTypeBtns = document.querySelectorAll('input[name="type"]');

        this.mortgageAmountField = document.querySelector('input[name="amount"]');
        this.mortgageTermField = document.querySelector('input[name="term"]');
        this.mortgageRateField = document.querySelector('input[name="rate"]');

        this.monthlyField = document.querySelector('#monthlyResult');
        this.totalField = document.querySelector('#totalResult');
    }

    // Initialize the Class

    init() {
        this.togglePanel();
        this.setupMortgageTypeSelection();
    }

    // Final Methods

    togglePanel() {
        if (!this.checkHistoryBtn || !this.resultsPreview) {
            console.warn('Button or panel are not found in the DOM!');
            return;
        }

        this.checkHistoryBtn.addEventListener('click', () => {
            this.displayResults();
        })
    }

    // Calculation Main Methods

    calculateMonthlyRepaymentInterest() {
        const mortgageAmount = this.calculateMortgageAmount();
        const monthlyInterestRate = this.calculateMontlyInterestRate();

        if (mortgageAmount === undefined || monthlyInterestRate === undefined) {
            return;
        }

        const monthlyRepayment = mortgageAmount * monthlyInterestRate;

        return this.roundUpToTwoDecimals(monthlyRepayment);
    }

    calculateTotalRepaymentInterest() {
        const mortgageAmount = this.calculateMortgageAmount();
        const totalNumberOfPayments = this.calculateTotalNumberOfPayments();
        const monthlyRepayment = this.calculateMonthlyRepaymentInterest(); 
    
        if (totalNumberOfPayments === undefined || monthlyRepayment === undefined || mortgageAmount === undefined) {
            return;
        }
    
        const totalRepayment = monthlyRepayment * totalNumberOfPayments + mortgageAmount;
        return this.roundUpToTwoDecimals(totalRepayment);
    }

    calculateMonthlyRepayment() {
        const mortgageAmount = this.calculateMortgageAmount();
        const monthlyInterestRate = this.calculateMontlyInterestRate();
        const totalNumberOfPayments = this.calculateTotalNumberOfPayments();

        if (mortgageAmount === undefined || monthlyInterestRate === undefined || totalNumberOfPayments === undefined) {
            return;
        }

        const monthlyRepayment = mortgageAmount * 
        ((monthlyInterestRate * (1 + monthlyInterestRate) ** totalNumberOfPayments) 
        / ((1 + monthlyInterestRate) ** totalNumberOfPayments - 1));

        return this.roundUpToTwoDecimals(monthlyRepayment);
    }

    calculateTotalRepayment() {
        const totalNumberOfPayments = this.calculateTotalNumberOfPayments();
        const monthlyRepayment = this.calculateMonthlyRepayment(); 
    
        if (totalNumberOfPayments === undefined || monthlyRepayment === undefined) {
            return;
        }
    
        const totalRepayment = monthlyRepayment * totalNumberOfPayments;
        return this.roundUpToTwoDecimals(totalRepayment);
    }

    // Display update methods

    displayResults() {
        if (!this.monthlyField || !this.totalField) {
            console.warn("Could not find display inputs in the DOM");
            return;
        }
        let monthlyInterest;
        let totalInterest;
        if (this.mortgageType === 'interest') {
            monthlyInterest = this.calculateMonthlyRepaymentInterest();
            totalInterest = this.calculateTotalRepaymentInterest();
        } else {
            monthlyInterest = this.calculateMonthlyRepayment();
            totalInterest = this.calculateTotalRepayment();
        }

        if (monthlyInterest === undefined || totalInterest === undefined) {
            return;
        }

        this.monthlyField.value = this.currency + monthlyInterest;
        this.totalField.value = this.currency + totalInterest;
    }

    // Calculation Helpers

    roundUpToTwoDecimals(num: number): number {
        return Math.ceil(num * 100) / 100;
    }

    calculateMortgageAmount() {
        const fieldValue = this.validateInput(this.mortgageAmountField, true);
        if (typeof(fieldValue) === 'number') {
            return fieldValue;
        }
        console.log('Amount is undefined!');
    }

    calculateMontlyInterestRate() {
        const fieldValue = this.validateInput(this.mortgageRateField);
        if (typeof(fieldValue) === 'number') {
            return fieldValue / 12 / 100;
        }
        console.log('Rate is undefined!');
    }

    calculateTotalNumberOfPayments() {
        const fieldValue = this.validateInput(this.mortgageTermField);
        if (typeof(fieldValue) === 'number') {
            return fieldValue * 12;
        }
        console.log('Term is undefined!');
    }

    // Handle Mortgage Type Field

    getMortgageType() {
        const errorField = document.querySelector(this.radioBtnErrorField);
            if (!errorField) {
                console.warn(`Couldn't find the error field`);
                return;
            }
        if (this.mortgageType === '') {
            errorField.textContent = 'Please choose the mortgage type!';
            return;
        }
        errorField.textContent = '';
        return this.mortgageType;
    }

    setupMortgageTypeSelection() {
        if (!this.mortgageTypeBtns) {
            console.warn('Radio buttons are not found in the DOM!');
            return;
        }
        this.mortgageTypeBtns.forEach((radio) => {
            if (radio.checked) {
                this.mortgageType = radio.id;
            }
            radio.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    this.mortgageType = target.id;
                }
            });
        });
    }

    // Handle Numberic Fields

    displayError(errorMessage: string, element: HTMLInputElement) {
        const inputParent = element.closest(this.inputParentSelector);
        const errorField = inputParent?.querySelector(this.errorHolderSelector);
        if (!errorField) {
            console.warn(`Couldn't find the error field`);
            return;
        }
        errorField.textContent = errorMessage;
    }

    resetErrorField(element: HTMLInputElement) {
        const inputParent = element.closest(this.inputParentSelector);
        const errorField = inputParent?.querySelector(this.errorHolderSelector);
        if (!errorField) {
            console.warn(`Couldn't find the error field`);
            return;
        }
        errorField.textContent = '';
    }

    validateInput(inputElement: HTMLInputElement | null, removeCommas: boolean = false): number | void {
        if (!inputElement) {
            console.warn(`Couldn't find the input field`);
            return;
        }
        let value: string = inputElement.value.trim(); 

        if (removeCommas) {
            value = value.replace(/[.,]/g, '');
        }
        
        // Check if the input is empty
        if (value === '') {
            const errorMessage = 'Please fill in this field!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        // Check if the input is a valid number
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const errorMessage = 'Please enter a valid number!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        // Ensure the value is not a negative number
        if (numericValue < 0) {
            const errorMessage = 'The number should not be negative!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        // Check for extremely large or small numbers (overflow/underflow protection)
        if (!isFinite(numericValue)) {
            const errorMessage = 'The number is too large or too small!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        this.resetErrorField(inputElement);
        return numericValue;
    }
    
}
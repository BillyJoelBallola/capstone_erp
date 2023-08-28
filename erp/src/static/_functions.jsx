export const formatMoney = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP', // You can change this to the desired currency code
        minimumFractionDigits: 2,
    });
    
      return formatter.format(value);  
}
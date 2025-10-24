export default function formatMoney(value: number){
    return `${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kz`;
}
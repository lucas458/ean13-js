// TYPE: A/C
const NUMBER_SET = [0x90, 0x54, 0x45, 0x30, 0x09, 0x18, 0x03, 0x21, 0x12, 0x81];

// Left half of an EAN-13 barcode 
const DIGIT_SET = [0x00, 0x0B, 0x0D, 0x0E, 0x13, 0x19, 0x1C, 0x15, 0x16, 0x1A];



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


function createModule(isDark, isLong, width = 1){
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.classList.toggle("barLong", isLong);
    bar.classList.add( isDark? "dark" : "space" );
    bar.style.width = width + 'px';
    barcode.appendChild(bar);
}


function getArrayFromNumberSet( valueDigit, isTypeB = false ){
    const list = new Array(4).fill(0).map((e, i) => {
        const currentBit = (isTypeB)? 2*i : (3-i)*2;
        return ((NUMBER_SET[valueDigit] >> currentBit) & 0x03) + 1;
    });
    return list;
}


function getCheckSum( code ){
    let oddEven = new Array(2).fill(0);
    for (let i = 0; i < code.length; i++){
        const value = parseInt(code[code.length-i-1]);
        const index = Math.trunc(i%2 != 0);
        oddEven[index] += value;
    }
    return ( 10 - [ (3 * oddEven[0] + oddEven[1]) % 10 ] ) % 10;
}


function generateEAN13( code ){
    const dv                = getCheckSum(code);
    const finalCode         = code.concat(dv);
    const currentDigitSet   = DIGIT_SET[finalCode[0]];

    barcode.innerHTML        = '';
    barcode_number.innerHTML = `<small>${finalCode[0]}</small> ${finalCode.substr(1, 6)} ${finalCode.substr(7, 6)}`;
    
    // START
    createModule(true,  true);
    createModule(false, true);
    createModule(true,  true);
    
    
    // Left
    for (let i = 0; i < 6; i++){
        const isTypeB = Boolean(currentDigitSet & 1 << (5-i));
        const list = getArrayFromNumberSet(finalCode[i+1], isTypeB); 
        list.forEach((e, idx) => createModule(idx%2 != 0, false, e) );
    }
    
    
    // MIDDLE
    createModule(false, true);
    createModule(true,  true);
    createModule(false, true);
    createModule(true,  true);
    createModule(false, true);


    // Right
    for (let i = 7; i <= 12; i++){
        const list = getArrayFromNumberSet(finalCode[i], false);
        list.forEach((e, idx) => createModule(idx%2 == 0, false, e) );
    }
    

    // STOP
    createModule(true,  true);
    createModule(false, true);
    createModule(true,  true);

}



function generateRandomCode(){
    return Math.random().toString().slice(-12);
}


function onClickGerar(){
    const code      = inputCode.value;
    const isNumbers = (/^\d+$/).test(code);
    if ( code.length < 12 || !isNumbers ){
        barcode.innerHTML = '';
        return;
    }
    generateEAN13(code);
}


function onClickGerarAleatorio(){
    const code      = generateRandomCode();
    inputCode.value = code;
    generateEAN13(code); 
}




inputColorFG.oninput = inputColorBG.oninput = () => {
    document.documentElement.style.setProperty('--fg', inputColorFG.value);
    barcode.style.backgroundColor = inputColorBG.value;
};

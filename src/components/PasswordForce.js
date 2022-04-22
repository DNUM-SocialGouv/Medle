import React from "react"
import { CommonWords, Frequences } from "../utils/passwordConstants"

export const PasswordForce = ({ password }) => {
  
    return (
      <div
        id="progress"
        class={`c-progress strength-${ScorePassword(password)}`}
        style={{
            marginTop: "4px",
            width: "1%",
            height: "5px"
        }}>
      </div>
    )
}

function SetComplexity(s, color) {
    const e = document.getElementById("progress");
    e.style.width = Math.min(s, 100)+"%";
    e.style.backgroundColor = color;
}

function ScorePassword(password) {
    React.useEffect(() => {
        let bits = 0, score = "";
    
        bits = Math.round(EvalPassword(password, 0));
        
        if (bits < 24) {
            score = "E";
        } else if (bits < 48) {
            score = "D";
        } else if (bits < 64) {
            score = "C";
        } else if (bits < 80) {
            score = "B";
        } else {
            score = "A";
        }
    
        SetComplexity(bits, GetColorFromScore(score));
        return bits;
    })
}

function EvalPassword(password, depth) {
    if (password.length == 0) {
        return 0;
    }

    let dedup = Deduplicate(password);
    if ( password.length - dedup.length > 2) {
        return EvalPassword(dedup, depth + 1) + (password.length - dedup.length) * BitsRepeatedChar ;
    }
    let lower = FrenchLowerCase(password);
    let r = FreqEvalPassword(lower); 

    if (depth > 3) {
        return r;
    }

    let toogled = Toogle(lower);
    if ( toogled != lower ) {
        let v = EvalPassword(toogled, depth+1) + Delta(toogled, lower);
        if ( v < r ) {
            r = v;
        }
    }

    let l = Math.min(lower.length, MaxComponentsLength);
    // on commence en recherchant les plus grands composants
    for (let m=l; m >= MinComponentsLength; m--) {
        // les prefix et suffix peuvent être vides
        for (let i=0; i+m <= l; i++) {
            let prefix = lower.slice(0,i);
            let sub = lower.slice(i, i+m)
            let suffix = lower.slice(i+m, l);
            // presence dans dictionnaire
            if (CheckCommonWords(sub)) {
                let v = EvalPassword(prefix, depth+1) + BitsCommonWords + EvalPassword(suffix, depth+1);
                if ( v < r ) {
                    r = v;
                }
            }
            // auto-similarité
            if (prefix.indexOf(sub)>=0 || suffix.indexOf(sub)>=0 ) {
                let v = EvalPassword(prefix, depth+1) + BitsCommonWords + EvalPassword(suffix, depth+1);
                if ( v < r ) {
                    r = v;
                }                
            }
        }
    }

    let i = FirstNum(password);
    if (i >= 0) {
        let prefix = password.slice(0,i);
        let residue = password.slice(i, l);
        let m = LastId(residue);
        let sub = password.slice(i,i+m);
        if (sub.length >= MinComponentsLength ) {
            let suffix = password.slice(i+m, l);
            let v = EvalPassword(prefix, depth+1) + Math.min(sub.length * BitsNumID, 48) + EvalPassword(suffix, depth+1);
            if ( v < r ) {
                r = v;
            }
        }
    } 

    // il ne faut pas oublier de prendre en compte les modifs
    return r + Delta(password,lower);
}

const MinComponentsLength = 4
const MaxComponentsLength = 12
const BitsCommonWords = Math.log2(Object.keys(CommonWords).length);
const BitsCharset = Math.log2(74);
const BitsNumID = Math.log2(10);
const BitsRepeatedChar = 1.0;

function FreqEvalPassword (password) {
    if (password.length == 0) {
        return 0;
    }
    let bits = BitsCharset;
    let aidx = GetFrequencesIndex(password.charAt(0));
    for (let b = 1; b < password.length; b ++)
    {
        let c = 0 ;
        let bidx = GetFrequencesIndex(password.charAt(b));
        c = 1.0 - Frequences[aidx * 27 + bidx];
        bits += BitsCharset * c * c; 
        aidx = bidx;
    }
    return bits;
}

function GetFrequencesIndex(c) {
    c = c.charAt(0).toLowerCase();
    if (c < 'a' || c > 'z')
    {
    return 0;
    }
    return c.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
}

function FrenchLowerCase(s) {
    let r = s.toLowerCase();
    r = r.replace(/é/g, "e").replace(/è/g, "e").replace(/ê/g, "e").replace(/ë/g, "e");
    r = r.replace(/à/g, "a").replace(/â/g, "a").replace(/â/g, "a");
    r = r.replace(/ô/g, "o").replace(/ö/g, "o");
    r = r.replace(/ù/g, "u").replace(/û/g, "u").replace(/ü/g, "u");
    r = r.replace(/î/g, "i").replace(/ï/g, "i");
    r = r.replace(/ç/g, "c");
    return r;
}

function Toogle(s) {
    let r = s.replace(/4/g, "a").replace(/@/g, "a").replace(/6/g, "b").replace(/</g, "c").replace(/{/g, "c");
    r = r.replace(/3/g, "e").replace(/9/g, "g").replace(/1/g, "i").replace(/\!/g, "i");
    r = r.replace(/0/g, "o").replace(/9/g, "q").replace(/5/g, "s").replace(/\$/g, "s");
    r = r.replace(/7/g, "t").replace(/\+/g, "t").replace(/\%/g, "x");
    return r;
}

function Delta(s1, s2){
    let l = s1.length, delta = 0;
   
    for (let i=0; i < l; i++) {
        if (s1[i] != s2[i]) {
            delta++;
        }
    }
    return delta;
}

function Deduplicate(s) {
    let l = s.length;
    if ( l<2 ) { return s; }
    let dd = s[0];
    for (let i=1; i < l; i++) {
        if (s[i] != s[i-1]) {
            dd = dd.concat(s[i]);
        }
    }
    return dd;
}

const NumCharset = "0123456789";
function FirstNum(s) {
    let i=0, l = s.length;
    while ( i<l && NumCharset.indexOf(s[i])<0 ) {
        i++;
    }
    if ( i == s.length) {
        return -1;
    }
    return i;
}

const IdCharset = "0123456789.-/: ";
function LastId(s) {
    let i=0, l = s.length;
    while ( i<l && IdCharset.indexOf(s[i])>=0 ) {
        i++;
    }
    return i; 
}

function CheckCommonWords(s) {
    if (CommonWords[s]) {
        return true;
    }
    return false;
}

function GetColorFromScore(score) {
    switch (score) {
        case "A":
            return "#009036";
        case "B":
            return "#b1c800";            
        case "C":
            return "#fecc00";
        case "D":
            return "#f29400";
        case "E":
            return "#e2001a";
        default:
            return "#666666";
    }
}
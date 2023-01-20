import { Component, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnChanges{
  @Input() public passwordToCheck!: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar3: string;
  msg = '';
private colors = ['red', 'orange', 'orange', 'red', 'green'];

private static checkStrength(p) {
  let force = 0;
  const regex = /[$-/:-?{-~!"^_@`\[\]]/g;

  const lowerLetters = /[a-z]+/.test(p);
  const upperLetters = /[A-Z]+/.test(p);
  const numbers = /[0-9]+/.test(p);
  const symbols = regex.test(p);

  const flags = [lowerLetters, upperLetters, numbers, symbols];

  let passedMatches = 0;
  for (const flag of flags) {
    passedMatches += flag === true ? 1 : 0;
  }

  force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
  force += passedMatches * 10;


  force = (p.length < 8) ? Math.min(force, 10) : force;


  force = (passedMatches == 1 && p.length>=8) ? Math.min(force, 20) : force;
  force = (passedMatches === 2) ? Math.min(force, 30) : force;
  force = (passedMatches >=3) ? Math.min(force, 40) : force;

  return force;
}

ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
  const password = changes.passwordToCheck.currentValue;
  this.setBarColors(4, '#DDD');
  if (password) {
    const c = this.getColor(PasswordStrengthComponent.checkStrength(password));
    this.setBarColors(c.idx, c.col);

    const pwdStrength = PasswordStrengthComponent.checkStrength(password);
    pwdStrength === 40 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);

    switch (c.idx) {
      case 1:
        this.msg = 'Easy';
        break;
      case 2:
        this.msg = 'Medium';
        break;
      case 4:
        this.msg = 'Minimum 8 characters!';
        break;
      case 5:
        this.msg = 'Strong';
        break;
    }
  } else {
    this.msg = '';
  }
}


private getColor(s) {
  let idx = 0;
  if (s <= 10) {
      idx = 3;
  } else if (s <= 20) {
      idx = 0;
  } else if (s <= 30) {
      idx = 1;
  } else if (s <= 40) {
      idx = 4;
  } else {
      idx = 4;
  }
  return {
      idx: idx + 1,
      col: this.colors[idx]
  };
}

private setBarColors(count, col) {
  if (count===5){
    for (let n = 0; n < count-1; n++) {
      this['bar' + n] = col;
    }
  }
  else{
  for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }
}

}

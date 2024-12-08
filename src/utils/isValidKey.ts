export function isValidKey(key: string): boolean {
    // only allow s3 safe characters and characters which require special handling for now
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
    return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(removePolishChars(key));
  }
  
  export function removePolishChars(text: string): string {
    const polishChars: { [key: string]: string } = {
      ą: 'a',
      ć: 'c',
      ę: 'e',
      ł: 'l',
      ń: 'n',
      ó: 'o',
      ś: 's',
      ż: 'z',
      ź: 'z',
      Ą: 'A',
      Ć: 'C',
      Ę: 'E',
      Ł: 'L',
      Ń: 'N',
      Ó: 'O',
      Ś: 'S',
      Ż: 'Z',
      Ź: 'Z',
    };
  
    return text.replace(/[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]/g, char => polishChars[char] || char);
  }
  
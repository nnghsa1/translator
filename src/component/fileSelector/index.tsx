import React from 'react';

interface IProps {
  onChange: (file: any) => void;
  title?: string;
}

export default class FileSelector extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
  }

  private inputRef = React.createRef<HTMLInputElement>();

  handleFileChange = (e: any) => {
    console.log(e)
    this.props.onChange(e.target.files[0]);
  };

  render() {
    return (
      <form>
        <div>
          <label>{this.props.title}</label>
          <input 
          ref={this.inputRef} 
          type="file" 
          name="file" 
          onChange={this.handleFileChange}
          />
        </div>
      </form>
    );
  }
}

const Table = ({ currentRoom }) => 
  <table>
    <tbody>
    {currentRoom.map((row, i) =>
      <tr key={i}>
        {row.map((cell, j) => <td 
          key={j} 
          className={cell !== 0 ? isNaN(cell) ? 'wall' : 'dirt' : ''}>
            <span style={{opacity: isNaN(cell) ? 1 : cell / 5}}></span>
          </td>
        )}
      </tr>
    )}
    </tbody>
  </table>;

export default Table;

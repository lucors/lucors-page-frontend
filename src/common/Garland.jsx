export function Garland() {
  const month = (new Date()).getMonth();

  if (month === 11 || month === 0) {
    return (
      <div id="garland"></div>
    );
  }
}

const server = 'http://localhost:3000/'
const intervalDelay = 1

const ctx = document.getElementById('myChart').getContext('2d')

var chart = new Chart(ctx, {
  type: 'line',

  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45]
    }]
  },

  options: {}
})

this.timer = setInterval(() => {
  fetchData().then(res => {
    console.log(res)
  })
}, intervalDelay * 1000)

fetchData = async () => {
  const response = await fetch(server + 'query-data')
  const body = await response.json()
  if (response.status !== 200) {
    throw Error(body.message)
  }
  return body
}

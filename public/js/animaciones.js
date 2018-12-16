anime({
    targets: '.navbar-brand, .nav-item',
      duration: 1000,
      translateX: [
          {value: 20},
          {value: 0}
      ],
      easing: 'easeInOutSine',
      delay: (elem,i)=> i*100,
      loop: false
  })

  anime({
    targets: '.card',
    duration: 750,
    rotate: [{value:10},{value:0}],
    easing: 'easeInOutSine',
   delay: (elem,i)=> i*200,
    loop: false
  })
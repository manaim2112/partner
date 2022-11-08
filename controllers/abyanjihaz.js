const express = require('express')
const app = express.Router()
const fs = require('fs')
const {randomUUID} = require('crypto')


app.get('/auth', (req, res) => {
    res.sendFile('auth.html', {
        root : "./views/abyan-jihaz"
    })
})
app.get('/', (req, res) => {
    res.redirect('/abyan-jihaz/auth')
})

app.get('/admin', (req, res) => {
    res.sendFile('admin.html', {
        root : "./views/abyan-jihaz"
    })
})

app.get('/admin/pengguna/get', (req, res) => {
    try {
        const pengguna =  fs.readFileSync('./database/abyan-jihaz/pengguna.json', 'utf-8')

        res.status(200).json(JSON.parse(pengguna))
    } catch (error) {
        console.error(error)
        res.status(200).json([])
    }
})
app.get('/admin/pengguna', (req, res) => {
    res.sendFile('pengguna.html', {
        root : "./views/abyan-jihaz"
    })
})
app.post('/admin/pengguna/create', (req, res) => {
    try {
        const get = fs.readFileSync('./database/abyan-jihaz/pengguna.json', 'utf-8')
        let decode = JSON.parse(get)

        const {login, fullname}= req.body
        const data = {
            uuid : randomUUID(),
            login : login.trim().split(' ').join(''), fullname
        }
        decode.push(data)
        fs.writeFileSync('./database/abyan-jihaz/pengguna.json', JSON.stringify(decode), 'utf-8')

        res.status(200).json({ok : true})
    } catch (error) {
        res.status(200).json({ok :false})
    }
})
app.get('/admin/pengguna/remove/:uuid', (req, res) => {
    try {
        const get = fs.readFileSync('./database/abyan-jihaz/pengguna.json', 'utf-8')
        let decode = JSON.parse(get)
        const findIndex = decode.findIndex(va => va.uuid == req.params.uuid)
        decode.splice(findIndex, 1)

        fs.writeFileSync('./database/abyan-jihaz/pengguna.json', JSON.stringify(decode), 'utf-8')

        res.redirect('back')
        
    } catch (error) {
        res.redirect('back')
    }
})
app.get('/admin/cepat/remove/:uuid', (req, res) => {
    try {
        const get = fs.readFileSync('./database/abyan-jihaz/cepat.json', 'utf-8')
        let decode = JSON.parse(get)
        const findIndex = decode.findIndex(va => va.uuid == req.params.uuid)
        decode.splice(findIndex, 1)

        fs.writeFileSync('./database/abyan-jihaz/cepat.json', JSON.stringify(decode), 'utf-8')

        res.redirect('back')
        
    } catch (error) {
        res.redirect('back')
    }
})

app.get('/admin/cepat', (req, res) => {
    res.sendFile('cepat.html', {
        root : "./views/abyan-jihaz"
    })
})
app.get('/admin/cepat/see', (req, res) => {
    res.redirect('/abyan-jihaz/admin/cepat')
})
app.get('/admin/cepat/see/:uuid', (req, res) => {
    res.sendFile('see-cepat.html', {
        root: "./views/abyan-jihaz"
    })
})
app.get('/admin/cepat/see/:uuid/remove/key/:key', (req, res) => {
    try {
        const cepatResult = fs.readFileSync('./database/abyan-jihaz/cepat-result.json', 'utf-8')
        let decode = JSON.parse(cepatResult)
        const {key} = req.params
        decode.splice(key, 1)
        fs.writeFileSync('./database/abyan-jihaz/cepat-result.json', JSON.stringify(decode), 'utf-8')

        res.redirect('back')
    } catch (error) {
        res.redirect('back')
    }
})
app.get('/admin/cepat/see/:uuid/get', (req, res) => {
    try {
        const {uuid} = req.params
        const cepat = fs.readFileSync('./database/abyan-jihaz/cepat.json', 'utf-8')
        const pengguna = fs.readFileSync('./database/abyan-jihaz/pengguna.json', 'utf-8')
        const cepatResult = fs.readFileSync('./database/abyan-jihaz/cepat-result.json', 'utf-8')
        const [dcepat, dpengguna, dcepatResult] = [JSON.parse(cepat), JSON.parse(pengguna), JSON.parse(cepatResult)]
        const filterByIdCepat = dcepatResult.filter(Obj => Obj.idcepat == uuid)
        if(filterByIdCepat.length < 1) return res.status(200).json([])
        const data = filterByIdCepat.map(e => {
            const h = dpengguna.findIndex(t => t.uuid == e.iduser)
            e.name = dpengguna[h].fullname
            return e
        }) 
        const f = dcepat.findIndex(t => t.uuid == uuid)
        data.original = dcepat[f].text
        const daata = {data, original : dcepat[f].text }
        res.status(200).json(daata)
    } catch (error) {
        console.error(error)
        res.status(200).json([])
    }
})
app.get('/admin/cepat/get', (req, res) => {
    try {
        const pengguna =  fs.readFileSync('./database/abyan-jihaz/cepat.json', 'utf-8')

        res.status(200).json(JSON.parse(pengguna))
    } catch (error) {
        console.error(error)
        res.status(200).json([])
    }
})
app.post('/admin/cepat/create', (req, res) => {
    try {
        try {
            const get = fs.readFileSync('./database/abyan-jihaz/cepat.json', 'utf-8')
            let decode = JSON.parse(get)
    
            const {text}= req.body
            const data = {
                uuid : randomUUID(),
                text : text.trim().split(' ').join('')
            }
            decode.push(data)
            fs.writeFileSync('./database/abyan-jihaz/cepat.json', JSON.stringify(decode), 'utf-8')
    
            res.status(200).json({ok : true})
        } catch (error) {
            res.status(200).json({ok :false})
        }
    } catch (error) {
        
    }
})


app.get('/pengguna', (req, res) => {
    res.redirect('/abyan-jihaz/pengguna/auth')
})
app.get('/pengguna/auth', (req, res) => {
    res.sendFile('auth.client.html', {
        root : "./views/abyan-jihaz"
    })
})
app.post('/pengguna/auth-check', (req, res) => {
    try {
        const {name} = req.body
        const get = fs.readFileSync('./database/abyan-jihaz/pengguna.json', 'utf-8')
        const decode = JSON.parse(get)
        
        const findIndex = decode.findIndex(h => h.login == name)
        if(findIndex == -1) return res.status(200).json({uuid :false})

        const getUser = decode[findIndex]
        res.status(200).json(getUser)
    } catch (error) {
        
    }
})
app.get('/pengguna/id/:uuid', (req, res) => {
    res.sendFile('pengguna.client.html', {
        root : './views/abyan-jihaz'
    })
})

app.get('/pengguna/id/:uuid/get', (req, res) => {
    try {
        const get = fs.readFileSync('./database/abyan-jihaz/pengguna.json', 'utf-8')
        const decode = JSON.parse(get)

        const findIndex = decode.findIndex(i => i.uuid == req.params.uuid)
        const getUser = decode[findIndex]
        res.status(200).json(getUser)
    } catch (error) {
        res.status(200).json({fullname : 'Anda Belum Login'})
    }
})

app.get('/pengguna/id/:uuid/cepat', (req, res) => {
    res.sendFile('cepat.client.html', {
        root : './views/abyan-jihaz'
    })
})
app.get('/pengguna/id/:uuid/cepat/get', (req, res) => {
    try {
        const cepat =  fs.readFileSync('./database/abyan-jihaz/cepat.json', 'utf-8')
        const decode = JSON.parse(cepat)


        res.status(200).json(decode)

    } catch (error) {
        res.status(200).json([])
    }
})

app.get('/pengguna/id/:uuid/cepat/id/:id', (req, res) => {
    res.sendFile('cepat.id.client.html', {
        root : './views/abyan-jihaz'
    })
})
app.post('/pengguna/id/:uuid/cepat/id/:id/savedata', (req, res) => {
    try {
        const {data, poin, time, iduser, idcepat} = req.body

        const save = {data, poin, time, iduser, idcepat}

        const cepat =  fs.readFileSync('./database/abyan-jihaz/cepat-result.json', 'utf-8')
        const decode = JSON.parse(cepat)
        decode.push(save)

        fs.writeFileSync('./database/abyan-jihaz/cepat-result.json', JSON.stringify(decode), 'utf-8')
        res.status(200).json({ok :true})
    } catch (error) {
        console.error(error)
        res.status(200).json({ok :false})
    }
})


app.get('/pengguna/id/:uuid/cepat/id/:id/get', (req, res) => {
    try {
        const cepat =  fs.readFileSync('./database/abyan-jihaz/cepat.json', 'utf-8')
        const decode = JSON.parse(cepat);
        const findIndex = decode.findIndex(t => t.uuid == req.params.id)
        if(findIndex == -1) return res.json({text : null})
        const get = decode[findIndex]
        res.status(200).json(get)
    } catch (error) {
        res.status(200).json({text : null})
    }
})
module.exports = app
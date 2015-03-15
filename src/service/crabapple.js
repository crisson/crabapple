import request from 'superagent'
import Bacon from 'baconjs'
import localforage from 'localforage'

const DEFAULT_FILE = 'data/words.txt'

const WORD_LIST_KEY = 'wordList'

const getFromStorage = () => {
    return localforage.getItem(WORD_LIST_KEY)
}

export default {
    /**
     * Retrieve list of words with each new word occupying its own line
     * @param  {String} file
     * @return {Bacon.Bus}
     */
    retrieve(file = DEFAULT_FILE){

        // let bus = Bacon.fromPromise(getFromStorage)
        //     .map(words => {
        //         if (words) return {text: words};
        //         return new Bacon.Error("Wordlist not found")
        //     })
        //     .flatMapError(()=> {
        //         let req = request.get(file)
        //         return Bacon.fromNodeCallback(req.end.bind(req))
        //     })
        //     .map(req => req.text)
        let req = request.get(file)
        let bus =  Bacon.fromNodeCallback(req.end.bind(req))
            .map(req => req.text)
            // .flatMap(words => {
            //     console.log(words)
            //     let p = getFromStorage()
            //         .then(wl => {
            //             if (wl) return wl
            //             return localforage
            //                 .setItem(WORD_LIST_KEY, words)
            //         })
            //         .then(() => {
            //             return words
            //         })

            //     return Bacon.fromPromise(p)
            // })
            .map(words => {
                let filtered = words
                    .split('\n')

                let wordSet = new Set(filtered)
                return wordSet
            })
        return bus    
    }
}
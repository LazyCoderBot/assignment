const articleModel = require('./article.schema');
const keywordsModel = require('./keywords.schema')
require('./monngo.connect');

const generateMaps = (getAllKeyWords) => {
    const projectObj = {
        article : 1
    }
    const keyWordExpMap = {}
    getAllKeyWords.forEach(key => {
        keyWordExpMap[`${key.keyword}`] = key.tags.join('|')
        projectObj[key.keyword] = 1
    })

    return {projectObj,keyWordExpMap}
}

const getOccuraceQuery = (allKeyWords,keyWordExpMap) => {
    let query = {}
    allKeyWords.forEach(key => {
        let exp = keyWordExpMap[key]
        query[key] = {
            $size: {
                $filter: {
                    input: { $split: ["$body", " "] },
                    as: "text",
                    cond: {
                        $regexMatch: {
                            input: "$$text",
                            regex: new RegExp(exp, 'i')
                        }
                    }
                }
            }
        }
    })
    return query
}

const generateFinalResult = (finalObj,allKeyWords) => {
    finalObj.forEach(article => {
        article.Tag = []
        allKeyWords.forEach(key => {
            if(article[key] >= 3){
                article.Tag.push(key)
            }
        })
    })
    return finalObj
}

const main = async () => {
    try {
    const getAllKeyWords = await keywordsModel.find({}).lean()
    
    //O(n)
    const {projectObj,keyWordExpMap} = generateMaps(getAllKeyWords)

    const allKeyWords = Object.keys(keyWordExpMap)
    
    //O(n)
    const getKeyWordOccurances = await articleModel.aggregate([
        {
            $addFields: getOccuraceQuery(allKeyWords,keyWordExpMap)
        },
        {
            $project : projectObj
        }
    ])

    // O(n^2)
    const result = generateFinalResult(getKeyWordOccurances,allKeyWords)
    
    return result

    } catch (error) {
        console.log(error)
        process.exit()
    }
    
}

main().then(data => {
    console.log(data)
    process.exit();
})
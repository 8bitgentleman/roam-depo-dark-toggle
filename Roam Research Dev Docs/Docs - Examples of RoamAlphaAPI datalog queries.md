# Roam Research datalog examples

## [[datalog]] for writing pages
Find all pages with `Tags:: #writing`
```
(() => {
  let query = `[:find (pull ?e [:node/title])
                      :where 
						[?e :node/title ]
                        [?Tags-Attribute :node/title "Tags"]
                        [?writing-Ref :node/title "writing"]
                        [?Status-Attribute :node/title "Status"]
                        [?Tags :block/parents ?e]
                        [?Tags :block/refs ?Tags-Attribute]
                        [?Tags :block/refs ?writing-Ref]
                        [?Status :block/refs ?Status-Attribute]
                        [?Status :block/parents ?e]
                        (not
                          [?evergreen-Ref :node/title "evergreen"]     
                          [?Status :block/refs ?evergreen-Ref]
                        )
  						]
                        `;

  let result = window.roamAlphaAPI.q(query).flat();
	
  return result;
})();

```

## [[datalog]] to use regex matches
    - ```javascript
      
      (() => {
        let query = `[:find ?project
          :where 
              [?e :node/title ?project]
              [(re-pattern "(?i)\\b.*(Projects/).*") ?pattern]
              [(re-matches ?pattern ?project)]
          ]`;
      
        let result = window.roamAlphaAPI.q(query).flat();
      	
        return result;
      })();
      ```

## [[datalog]] Pages (filter multiple query results list)
- ```javascript
      (() => {
        // Query 1: Pages with less than 2 references
        let refQuery = `[:find ?title (count ?e)
                         :where
                         [?page :node/title ?title]
                         (or
                           [?e :block/refs ?page]
                           (and
                             [?e :block/page ?page]
                             [(not= ?e ?page)]))]`;
      
        let refResults = window.roamAlphaAPI.q(refQuery);
        let pagesWithLessThanTwoRefs = refResults.filter(result => result[1] < 2)
                                                 .map(result => result[0]);
      
        // Query 2: Pages with no children
        let childrenQuery = `[:find ?title
                              :where
                              [?page :node/title ?title]
                              (not [?child :block/page ?page])]`;
      
        let childrenResults = window.roamAlphaAPI.q(childrenQuery);
        let pagesWithNoChildren = childrenResults.map(result => result[0]);
      
        // Combine the results
        let pagesWithLessThanTwoRefsAndNoChildren = pagesWithLessThanTwoRefs.filter(title => 
          pagesWithNoChildren.includes(title)
        );
      
        return {
          pagesWithLessThanTwoRefs,
          pagesWithNoChildren,
          pagesWithLessThanTwoRefsAndNoChildren
        };
      })();
      ```

## [[datalog]] last 10 edited blocks
- ```javascript
      (() => {
        let query = `[:find (pull ?e [:edit/time :block/uid :block/string {:block/page [:node/title]}])
                            :in $ ?namespace
                            :where 
                              [?e :edit/time]
                              ]`;
      
        let results = window.roamAlphaAPI.q(query, 'test');
      
        // Filter out entries without a 'time' property and ensure results are properly structured
        let validResults = results.filter(result => result && result[0] && typeof result[0]['time'] !== 'undefined');
      
        // Sort the valid results by 'time' in descending order
        validResults.sort((a, b) => {
          let timeA = a[0]['time']; // Adjusted to 'time'
          let timeB = b[0]['time']; // Adjusted to 'time'
          return timeB - timeA;
        });
      
        // Get the latest 10 entries
        let latest10 = validResults.slice(0, 10);
      
        // Optionally map the results to a more readable format, if needed
        return latest10.flat();
      })();
      ```

## #datalog count words on multiple pages
    - ```javascript
      
      (() => {
        function countWords(data) {
          let wordCount = 0;
      
          data.children.forEach(block => {
            //omit code blocks
              if (block.string && !block.string.startsWith("``")) {
                  const words = block.string.split(/\s+/); // Split by whitespace
                  wordCount += words.length;
              }
          });
      
          return wordCount;
      }
      
        let query = `[:find (pull ?e [:block/string :node/title {:block/children ...}])
                            :in $ [?namespace ...]
                            :where 
      						[?e :node/title ?namespace]
      						]`;
      
        let results = window.roamAlphaAPI.q(query,['test', 'Testing']).flat();
      
        results.forEach(page => {
              const totalWords = countWords(page);
              console.log(page.title, totalWords)
          });
      })();
      ```

## #datalog to get all attributes in a graph ❗
    - ```javascript
      
      (() => {
        
        let query = `[:find
                        (pull ?page [:node/title])
                      :where
                        [?b :attrs/lookup _]
                        [?b :entity/attrs ?a]
                        [(untuple ?a) [[?c ?d]]]
                        [(get ?d :value) ?s]
                        [(untuple ?s) [?e ?uid]]
                        [?page :block/uid ?uid]
                      ]`;
      
        let result =  window.roamAlphaAPI.q(query).flat();
      	
        return result;
      })();
      ```

## pure #datalog search for TODOs on any DNP pages
    - ```javascript
      var rules = `[
          [(is-todo ?t)
           [?todo :node/title "TODO"]
           [?t :block/refs ?todo]
          ]
          [(is-dnp ?b)
           [(re-pattern "[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]") ?re-date]
           [?b :block/uid ?u]
           [(re-find ?re-date ?u)]     
          ]
           ]`;
      window.roamAlphaAPI.q(`
        [:find (pull ?t [:block/string :create/time])
          :in $ %
          :where 
          (is-todo ?t)
          [?t :block/parents ?d]
          (is-dnp ?d)    
        ]`, rules).flat();
      ```

## #datalog find the pages of blocks that reference a page 
    - ```javascript
      //single page
      (() => {
        let query = `[:find ?t
                            :in $ ?namespace
                            :where 
      						[?p :node/title ?namespace]
                              [?r :block/refs ?p]
                              [?r :block/page ?pr]
                              [?pr :node/title ?t]
                              ]`;
      
        let result = window.roamAlphaAPI.q(query,'testing').flat();
      
        return result;
      })();
      
      //multiple pages
      (() => {
        let query = `[:find ?t
                    :in $ [?namespace ...]
                    :where 
                    (or
                      [?p :node/title ?namespace]
                    )
                    [?r :block/refs ?p]
                    [?r :block/page ?pr]
                    [?pr :node/title ?t]
                   ]`;
      
      let result = window.roamAlphaAPI.q(query, ['aaa', 'zzz']).flat();
      	
        return result;
      })();
      ```

##  pull specific aspects from a recursive pull not everything
    - ```javascript
      (() => {
        let query = `[:find (pull ?e [:block/string 
                                      :block/uid 
                                      :node/title 
                                      :block/children 
                                      {:block/children ...} 
                                      {:block/page [
                                          :block/string 
                                          :block/uid 
                                          :node/title
                                      ]}])
                            :in $ ?uid
                            :where 
      						[?e :block/uid ?uid]
      						]`;
      
        let result = window.roamAlphaAPI.q(query,'8qapxS1FO').flat();
      	
        return result;
      })();
      ```

## #datalog query to pass in an array and pull multiple pages 
    - ```javascript
      
      (() => {
        let query = `[:find (pull ?e [*])
                    :in $ [?namespace ...]
                    :where 
                    (or
                      [?e :node/title ?namespace]
                      ;; Add more conditions here for additional page names
                    )
                   ]`;
      
      let result = window.roamAlphaAPI.q(query, ['test', 'testing']).flat();
      	
        return result;
      })();
      ```
## 
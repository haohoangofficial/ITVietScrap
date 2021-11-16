function getURLs() {
    max_page = 94 //Setting max page
    if(settingsTable.getRange(1,2).getValue() = null) {
        settingsTable.getRange(1,1).setValue('Page Number')
        settingsTable.getRange(1,2).setValue('1')
    }
    // number of pages will index from 1 to max_page
    let p = settingsTable.getRange(1,2).getValue();
    if(p > max_page) {
      return;
    }
    //https://itviec.com/it-jobs?page=1
    let url = "https://itviec.com/it-jobs?page=" + p
    // Load html from url
    var html = UrlFetchApp.fetch(url).getContentText();
    if (html) {
        // Load Cheerio library
        $ = Cheerio.load(html);
        let root = $('#jobs');
        let divjobs = root.find('div.job');
        for(let  i = 0; i < divjobs.length; i++) {
            let company = divjobs.get(i);
            let logo = $(company).find('div.logo');
            let company_url = 'https://itviec.com' + $(logo).find('a').attr('href');
            let atitle = $(company).find('h2.title')
            let title = $(atitle).text();
            let href = 'https://itviec.com' + $(atitle).find('a').attr('href');
            Logger.log(title);
            Logger.log(href);
        // Create new array data
        let jobs = [
            '=ROW()',
            company_url,
            title,
            href
        ]
        //Insert data to Sheet Table
        urlsTable.appendRow(jobs);
        }
    }
    //Set next page value
    settingsTable.getRange(1,2).setValue(p+1);
  }
  
  function getJobs() {
    let items = getItems(5);
    for(let item of items) {
      getJob(item[3]);
      urlsTable.getRange(item[0],6).setValue("0");
    }
  }
  function getJob(url) {
    //let url = 'https://itviec.com/it-jobs/business-analyst-leader-swiss-post-solutions-vietnam-3037';
    var html = UrlFetchApp.fetch(url).getContentText();
    if(html) {
      $ = Cheerio.load(html);
      let container = $('#container');
      let job_details = (container.find('h1.job-details__title').text()).trim();
      let job_details_sub_title = (container.find('div.job-details__sub-title').text()).trim();
      let job_details_second_title = container.find('h2.job-details__second-title');
      let job_details_top_reason_to_join_us = ($($(job_details_second_title).get(0)).text()).trim() + '\n' + (container.find('div.job-details__top-reason-to-join-us').text()).trim();
      let job_details_paragraph = container.find('div.job-details__paragraph')
      let jobdescription = ($($(job_details_second_title).get(1)).text()).trim() + '\n' + ($($(job_details_paragraph).get(0)).text()).trim();
      let skillsandexperience = ($($(job_details_second_title).get(2)).text()).trim() + '\n' + ($($(job_details_paragraph).get(1)).text()).trim();
      let whyyoullloveworkinghere = ($($(job_details_second_title).get(3)).text()).trim() + '\n' + ($($(job_details_paragraph).get(2)).text()).trim();
      let jobs = [
        '=ROW()',
        job_details,
        job_details_sub_title,
        url,
        job_details_top_reason_to_join_us,
        jobdescription,
        skillsandexperience,
        whyyoullloveworkinghere
      ]
      jobsTable.appendRow(jobs);
    }
  }
  
  function getCompanies() {
    let items = getItems(4);
    for(let item of items) {
      getCompany(item[1]);
      urlsTable.getRange(item[0],5).setValue("0");
    }
  }
  
  function getCompany(url) {
    //let url = "https://itviec.com/companies/swiss-post-solutions-vietnam";
    var html = UrlFetchApp.fetch(url).getContentText();
    if(html) {
      $ = Cheerio.load(html);
      let container = $('#container');
      let company_info_name = (container.find('h1.headers__info__name').text()).trim();
      let company_info_items = $($(container).find('div.headers__info__item')).find('div.svg-icon__text');
      let items = "";
      for(let i = 0; i < company_info_items.length; i++) {
        items = items + '\n' + ($($(company_info_items).get(i)).text()).trim()
      }
      let overview_title = ($($($(container).find('h3.panel-title')).get(0)).text()).trim();
      let overview = $($($(container).find('div.panel-body')).get(1))
      for(let j = 0; j< overview.length; j++) {
        overview_title = overview_title + '\n' + ($($(overview).get(j)).text()).trim();
      }
      let why_title = ($($($(container).find('h3.panel-title')).get(2)).text()).trim();
      let whyyoullloveworkinghere = $($($(container).find('div.panel-body')).get(2));
      why_title = why_title + "\n" + $($(whyyoullloveworkinghere).find("ul.reasons-to-join")).text() + $($(whyyoullloveworkinghere).find("div.panel-paragraph")).text()
      //
      let company = [
        company_info_name,
        url,
        items,
        overview_title,
        why_title
      ]
      companiesTable.appendRow(company);
    }
  }
  
  function getItems(i) {
    let urls = urlsTable.getDataRange().getValues();
    let sql = "SELECT MATRIX FROM ? WHERE ["+ i +"] = '' LIMIT 20";
    let response = alaSQL(sql,[urls]);
    //ogger.log(response)
    return response;
  }
  
  
  